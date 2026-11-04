import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import RegistrationSuccessModal from './components/RegistrationSuccessModal';
import AttendeeListModal from './components/AttendeeListModal';

// Pages
import SignInPage from './pages/SignInPage';
import BrowseEventsPage from './pages/BrowseEventsPage';
import EventDetailsPage from './pages/EventDetailsPage';
import CalendarPage from './pages/CalendarPage';
import MyRegistrationsPage from './pages/MyRegistrationsPage';
import HostEventPage from './pages/HostEventPage';
import OrganizerHubPage from './pages/OrganizerHubPage';

export default function App() {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentView, setCurrentView] = useState('browse');
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [successModalData, setSuccessModalData] = useState({
    isOpen: false,
    registration: null,
    event: null,
  });
  const [attendeeModalData, setAttendeeModalData] = useState({
    isOpen: false,
    eventId: null,
  });

  // If user is not authenticated, render Sign In (Figma Screen 1)
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-sm font-medium text-slate-500">Checking your Supabase session…</div>;
  }

  if (!isAuthenticated) {
    return (
      <>
        <Toast />
        <SignInPage onSignedIn={() => setCurrentView('browse')} />
      </>
    );
  }

  // Navigation handlers
  const handleSelectEvent = (id) => {
    setSelectedEventId(id);
    setCurrentView('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRegisterSuccess = (registration, event) => {
    setSuccessModalData({
      isOpen: true,
      registration,
      event,
    });
  };

  const handleOpenAttendees = (eventId) => {
    setAttendeeModalData({
      isOpen: true,
      eventId: eventId || selectedEventId,
    });
  };

  const getPageMeta = () => {
    switch (currentView) {
      case 'browse':
        return { title: 'Discover Campus Events', subtitle: 'Browse workshops, hackathons & socials' };
      case 'details':
        return { title: 'Event Details', subtitle: 'Overview, agenda, and registration' };
      case 'calendar':
        return { title: 'Campus Schedule', subtitle: 'Monthly academic & student events' };
      case 'registrations':
        return { title: 'My Registrations', subtitle: 'Your confirmed campus passes' };
      case 'host':
        return { title: 'Host an Event', subtitle: 'Create and publish to student directory' };
      case 'organizer':
        return { title: 'Organizer Management Hub', subtitle: 'Manage attendee rosters & capacity' };
      default:
        return { title: 'Campus Connect', subtitle: 'Student Events Hub' };
    }
  };

  const { title, subtitle } = getPageMeta();

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      {/* Toast notifications */}
      <Toast />

      {/* Modals */}
      <RegistrationSuccessModal
        isOpen={successModalData.isOpen}
        registration={successModalData.registration}
        event={successModalData.event}
        onClose={() => setSuccessModalData({ isOpen: false, registration: null, event: null })}
        onViewMyRegistrations={() => {
          setSuccessModalData({ isOpen: false, registration: null, event: null });
          setCurrentView('registrations');
        }}
        onBrowseMore={() => {
          setSuccessModalData({ isOpen: false, registration: null, event: null });
          setCurrentView('browse');
        }}
      />

      <AttendeeListModal
        isOpen={attendeeModalData.isOpen}
        eventId={attendeeModalData.eventId}
        onClose={() => setAttendeeModalData({ isOpen: false, eventId: null })}
      />

      {/* Left Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        setCurrentView={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          title={title}
          subtitle={subtitle}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        <main className="flex-1 pb-16">
          {currentView === 'browse' && (
            <BrowseEventsPage
              searchTerm={searchTerm}
              onSelectEvent={handleSelectEvent}
              onRegisterSuccess={handleRegisterSuccess}
            />
          )}

          {currentView === 'details' && (
            <EventDetailsPage
              eventId={selectedEventId}
              onBack={() => setCurrentView('browse')}
              onRegisterSuccess={handleRegisterSuccess}
              onOpenAttendees={handleOpenAttendees}
            />
          )}

          {currentView === 'calendar' && (
            <CalendarPage onSelectEvent={handleSelectEvent} />
          )}

          {currentView === 'registrations' && (
            <MyRegistrationsPage
              onSelectEvent={handleSelectEvent}
              onBrowseEvents={() => setCurrentView('browse')}
            />
          )}

          {currentView === 'host' && (
            <HostEventPage
              onEventCreated={(newEventId) => {
                setSelectedEventId(newEventId);
                setCurrentView('details');
              }}
            />
          )}

          {currentView === 'organizer' && (
            <OrganizerHubPage
              onSelectEvent={handleSelectEvent}
              onOpenAttendees={handleOpenAttendees}
              onHostNew={() => setCurrentView('host')}
            />
          )}
        </main>
      </div>
    </div>
  );
}
