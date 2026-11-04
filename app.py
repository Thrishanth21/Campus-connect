import os
from functools import wraps

from dotenv import load_dotenv
from flask import Flask, g, jsonify, request
from postgrest import APIError
from supabase import Client, create_client
from supabase.lib.client_options import SyncClientOptions

load_dotenv()

app = Flask(__name__)


@app.after_request
def add_cors_headers(response):
    # Local Vite development origin. Set FRONTEND_ORIGIN for a deployed frontend.
    origin = request.headers.get("Origin")
    allowed_origin = os.environ.get("FRONTEND_ORIGIN", "http://localhost:3000")
    if origin in {allowed_origin, "http://127.0.0.1:3000"}:
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Vary"] = "Origin"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, DELETE, OPTIONS"
    return response

supabase: Client = create_client(
    os.environ.get("SUPABASE_URL"),
    os.environ.get("SUPABASE_PUBLISHABLE_KEY"),
)


def error_response(message, status):
    return jsonify({"error": message}), status


def require_auth(handler):
    @wraps(handler)
    def wrapped(*args, **kwargs):
        scheme, _, token = request.headers.get("Authorization", "").partition(" ")
        if scheme.lower() != "bearer" or not token:
            return error_response("A valid Supabase bearer token is required", 401)
        try:
            auth_result = supabase.auth.get_user(token)
            user = auth_result.user
            if not user:
                return error_response("Invalid or expired Supabase access token", 401)
            g.user = user
            g.user_supabase = create_client(
                os.environ["SUPABASE_URL"],
                os.environ["SUPABASE_PUBLISHABLE_KEY"],
                options=SyncClientOptions(headers={"Authorization": f"Bearer {token}"}),
            )
        except Exception:
            return error_response("Invalid or expired Supabase access token", 401)
        return handler(*args, **kwargs)
    return wrapped


@app.get("/")
def index():
    return jsonify({"message": "Campus Events API", "endpoints": [
        "/api/events", "/api/events/<id>", "/api/registrations",
        "POST /api/events",
        "/api/me/registrations (Supabase bearer token required)",
        "/api/events/<id>/registrations",
    ]})


@app.get("/api/events")
def list_events():
    try:
        result = supabase.table("Events").select("*").execute()
        return jsonify(result.data), 200
    except APIError as error:
        return error_response(error.message, 500)


@app.post("/api/events")
@require_auth
def create_event():
    payload = request.get_json(silent=True)
    if not isinstance(payload, dict):
        return error_response("Request body must be a JSON object", 400)

    required = ("title", "date", "time", "location", "description")
    missing = [field for field in required if not payload.get(field)]
    if missing:
        return error_response(f"Required field(s): {', '.join(missing)}", 400)

    try:
        capacity = int(payload.get("capacity", 50))
    except (TypeError, ValueError):
        return error_response("capacity must be a whole number", 400)
    if not 1 <= capacity <= 10000:
        return error_response("capacity must be between 1 and 10000", 400)

    event = {
        "title": str(payload["title"]).strip(),
        "tagline": payload.get("tagline", ""),
        "category": payload.get("category", "Workshop"),
        "date": payload["date"],
        "time": payload["time"],
        "location": payload["location"],
        "building": payload.get("building", ""),
        "organizer_id": str(g.user.id),
        "organizer_name": (getattr(g.user, "email", None) or "Campus Organizer").split("@")[0],
        "organizer_role": "Organizer",
        "capacity": capacity,
        "description": payload["description"],
        "prerequisites": payload.get("prerequisites", ""),
        "schedule": payload.get("schedule", []),
        "accent_color": payload.get("accent_color", "#2563EB"),
        "is_spotlight": False,
        "tags": payload.get("tags", []),
    }
    if not event["title"]:
        return error_response("title cannot be empty", 400)

    try:
        result = g.user_supabase.table("Events").insert(event).select("*").execute()
        if not result.data:
            return error_response("Event was not returned after insert", 500)
        return jsonify(result.data[0]), 201
    except APIError as error:
        code = getattr(error, "code", None)
        if code in {"PGRST204", "42703"}:
            return error_response(
                "The Supabase Events table is missing a field required by this form. "
                "Run supabase-events-schema.sql in the Supabase SQL Editor, then retry.",
                503,
            )
        return error_response(error.message, 400 if code in {"23502", "23503", "23514", "22P02"} else 500)


@app.get("/api/events/<event_id>")
def get_event(event_id):
    try:
        result = (
            supabase.table("Events")
            .select("*")
            .eq("id", event_id)
            .limit(1)
            .execute()
        )
        if not result.data:
            return error_response("Event not found", 404)
        return jsonify(result.data[0]), 200
    except APIError as error:
        return error_response(error.message, 500)


@app.get("/api/registrations")
@require_auth
def list_registrations():
    """List only the authenticated user's registrations."""
    try:
        result = (
            g.user_supabase.table("registrations")
            .select("*")
            .eq("user_id", str(g.user.id))
            .execute()
        )
        return jsonify(result.data), 200
    except APIError as error:
        return error_response(error.message, 500)


@app.post("/api/registrations")
@require_auth
def create_registration():
    payload = request.get_json(silent=True)
    if not isinstance(payload, dict):
        return error_response("Request body must be a JSON object", 400)
    missing = [field for field in ("event_id",) if not payload.get(field)]
    if missing:
        return error_response(f"Required field(s): {', '.join(missing)}", 400)

    try:
        registration_payload = {"user_id": str(g.user.id), "event_id": payload["event_id"]}
        result = g.user_supabase.table("registrations").insert(registration_payload).execute()
        registration = result.data[0] if result.data else registration_payload
        return jsonify(registration), 201
    except APIError as error:
        if getattr(error, "code", None) == "23505":
            return error_response("A registration already exists", 409)
        if getattr(error, "code", None) == "23503":
            return error_response("Event not found", 404)
        return error_response(error.message, 500)


@app.get("/api/me/registrations")
@require_auth
def list_my_registrations():
    try:
        result = (
            g.user_supabase.table("registrations")
            .select("*")
            .eq("user_id", str(g.user.id))
            .execute()
        )
        return jsonify(result.data), 200
    except APIError as error:
        return error_response(error.message, 500)


@app.get("/api/events/<event_id>/registrations")
@require_auth
def list_event_registrations(event_id):
    try:
        event = (
            g.user_supabase.table("Events")
            .select("id,organizer_id")
            .eq("id", event_id)
            .limit(1)
            .execute()
        )
        if not event.data:
            return error_response("Event not found", 404)
        if str(event.data[0].get("organizer_id")) != str(g.user.id):
            return error_response("Only the event organizer can view its attendee list", 403)
        result = (
            g.user_supabase.table("registrations")
            .select("*")
            .eq("event_id", event_id)
            .execute()
        )
        return jsonify(result.data), 200
    except APIError as error:
        return error_response(error.message, 500)


if __name__ == "__main__":
    app.run(debug=True)
