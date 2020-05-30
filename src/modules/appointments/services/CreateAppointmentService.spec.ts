import FakeAppointmentRepository from '@modules/appointments/repositories/fakes/FakeAppointmentRepository';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import AppError from '@shared/errors/AppError';

describe('CreateAppointment', () => {
  it('should create a new appointment', async () => {
    const appointmentRepository = new FakeAppointmentRepository();
    const createAppointmentService = new CreateAppointmentService(
      appointmentRepository,
    );

    const appointment = await createAppointmentService.execute({
      date: new Date(),
      provider_id: '121212',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('121212');
  });

  it('should not be able to create two appintments on the same time', async () => {
    const appointmentRepository = new FakeAppointmentRepository();
    const createAppointmentService = new CreateAppointmentService(
      appointmentRepository,
    );

    const appointmentDate = new Date();

    await createAppointmentService.execute({
      date: appointmentDate,
      provider_id: '121212',
    });

    expect(
      createAppointmentService.execute({
        date: appointmentDate,
        provider_id: '121212',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
