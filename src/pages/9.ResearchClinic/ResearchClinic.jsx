import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Users, Video, BookOpen, X, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useGetAvailableResearchClinicDays, useGetStudentResearchClinicBookings, useBookResearchClinicSession, useCancelResearchClinicBooking } from '../../store/tanstackStore/services/queries';

const ResearchClinic = () => {
  const navigate = useNavigate();
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [selectedClinicDay, setSelectedClinicDay] = useState(null);
  const [bookingNotes, setBookingNotes] = useState('');

  // TanStack Query hooks
  const { data: clinicDaysData, isLoading: clinicDaysLoading } = useGetAvailableResearchClinicDays();
  const { data: bookingsData, isLoading: bookingsLoading } = useGetStudentResearchClinicBookings();
  
  // Mutations
  const bookSessionMutation = useBookResearchClinicSession();
  const cancelBookingMutation = useCancelResearchClinicBooking();

  // Extract isPending states for loading indicators
  const isBooking = bookSessionMutation.isPending;
  const isCancelling = cancelBookingMutation.isPending;

  const clinicDays = clinicDaysData?.clinicDays || [];
  const bookings = bookingsData?.bookings || [];

  const handleBookSession = async () => {
    if (!selectedClinicDay) return;

    try {
      await bookSessionMutation.mutateAsync({
        clinicDayId: selectedClinicDay.id,
        notes: bookingNotes
      });
      toast.success('Session booked successfully!');
      setShowBookingDialog(false);
      setSelectedClinicDay(null);
      setBookingNotes('');
    } catch (error) {
      toast.error(error.message || 'Failed to book session');
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      await cancelBookingMutation.mutateAsync(bookingId);
      toast.success('Booking cancelled successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to cancel booking');
    }
  };

  const openBookingDialog = (clinicDay) => {
    setSelectedClinicDay(clinicDay);
    setShowBookingDialog(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="secondary">Pending</Badge>;
      case 'CONFIRMED':
        return <Badge variant="default">Confirmed</Badge>;
      case 'COMPLETED':
        return <Badge variant="default" className="bg-green-500">Completed</Badge>;
      case 'CANCELLED':
        return <Badge variant="destructive">Cancelled</Badge>;
      case 'NO_SHOW':
        return <Badge variant="destructive">No Show</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  if (clinicDaysLoading || bookingsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Research Clinic</h1>
          <p className="text-gray-600 mt-2">
            Book sessions with research advisors to get guidance on your research project
          </p>
        </div>
       
      </div>

      {/* My Bookings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            My Bookings
          </CardTitle>
          <CardDescription>
            View and manage your research clinic bookings
          </CardDescription>
        </CardHeader>
        <CardContent>
          {bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">
                          {formatDate(booking.clinicDay.date)}
                        </span>
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {formatTime(booking.clinicDay.startTime)} - {formatTime(booking.clinicDay.endTime)}
                        </span>
                      </div>
                      {booking.notes && (
                        <p className="text-sm text-gray-600 mt-1">
                          <strong>Notes:</strong> {booking.notes}
                        </p>
                      )}
                      {booking.clinicDay.zoomLink && (
                        <div className="flex items-center gap-2 mt-2">
                          <Video className="h-4 w-4 text-blue-500" />
                          <a
                            href={booking.clinicDay.zoomLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm"
                          >
                            Join Zoom Meeting
                          </a>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(booking.status)}
                      {booking.status === 'PENDING' && (
                        <Button
                          onClick={() => handleCancelBooking(booking.id)}
                          variant="outline"
                          size="sm"
                          disabled={isCancelling}
                        >
                          {isCancelling ? (
                            <>
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-1"></div>
                              Cancelling...
                            </>
                          ) : (
                            'Cancel'
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No bookings found</p>
              <p className="text-sm text-gray-400">Book a session below to get started</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Clinic Days */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Available Clinic Days
          </CardTitle>
          <CardDescription>
            Select a day to book your research clinic session
          </CardDescription>
        </CardHeader>
        <CardContent>
          {clinicDays.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {clinicDays.map((day) => (
                <div key={day.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">{formatDate(day.date)}</span>
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      {day.availableSlots} slots left
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{formatTime(day.startTime)} - {formatTime(day.endTime)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>{day.maxBookings - day.availableSlots}/{day.maxBookings} booked</span>
                    </div>
                    {day.description && (
                      <p className="text-sm text-gray-600">{day.description}</p>
                    )}
                  </div>

                  <Button
                    onClick={() => openBookingDialog(day)}
                    className="w-full"
                    disabled={day.availableSlots === 0}
                  >
                    {day.availableSlots === 0 ? 'Full' : 'Book Session'}
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No available clinic days</p>
              <p className="text-sm text-gray-400">Check back later for new sessions</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Booking Dialog */}
      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book Research Clinic Session</DialogTitle>
            <DialogDescription>
              Confirm your booking for the selected clinic day
            </DialogDescription>
          </DialogHeader>
          
          {selectedClinicDay && (
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Session Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(selectedClinicDay.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{formatTime(selectedClinicDay.startTime)} - {formatTime(selectedClinicDay.endTime)}</span>
                  </div>
                  {selectedClinicDay.description && (
                    <p className="text-gray-600">{selectedClinicDay.description}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm font-medium">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any notes or questions for your session..."
                  value={bookingNotes}
                  onChange={(e) => setBookingNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowBookingDialog(false)}
                  disabled={isBooking}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleBookSession}
                  disabled={isBooking}
                >
                  {isBooking ? 'Booking...' : 'Confirm Booking'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResearchClinic; 