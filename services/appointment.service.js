const Appointment = require('../models/Appointment');
const User = require('../models/User');

class AppointmentService {
  async createAppointment(userId, dateTime, reason) {
    try {
      const appointment = new Appointment({
        userId,
        dateTime,
        reason
      });

      await appointment.save();
      
      await User.findByIdAndUpdate(userId, {
        $push: { appointments: appointment._id }
      });

      return appointment;
    } catch (error) {
      console.error('Appointment Service Error:', error);
      throw new Error('Failed to create appointment');
    }
  }

  async getUpcomingAppointments(userId) {
    try {
      return await Appointment.find({
        userId,
        dateTime: { $gte: new Date() }
      }).sort({ dateTime: 1 });
    } catch (error) {
      console.error('Appointment Service Error:', error);
      throw new Error('Failed to fetch appointments');
    }
  }
}

module.exports = new AppointmentService();