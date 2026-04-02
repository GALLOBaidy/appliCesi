const mockAxiosInstance = {
  get: jest.fn().mockReturnValue({ data: {} }),
  post: jest.fn().mockReturnValue({ data: {} }),
  put: jest.fn().mockReturnValue({ data: {} }),
  delete: jest.fn().mockReturnValue({ data: {} }),
  interceptors: {
    request: { use: jest.fn() },
    response: { use: jest.fn() },
  },
};

module.exports = {
  create: () => mockAxiosInstance,
  ...mockAxiosInstance,
};
