import { Order } from './order.model';

describe('Order', () => {
  it('should create an instance', () => {
    const mockOrder = new Order(
      'Product Name',
      '12345',
      'Carrier Name',
      '2021-01-01',
      '2021-01-10',
      'Online',
      1,
      'TRACK123',
      'User123'
    );
    expect(mockOrder).toBeTruthy();
  });
});
