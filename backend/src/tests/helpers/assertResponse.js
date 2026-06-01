const assertStandardResponse = (response) => {
  expect(response.body).toHaveProperty("success");
  
  // if it's successful or we expect a standardized error format
  if (response.body.success) {
    if (response.body.message !== undefined) {
      expect(typeof response.body.message).toBe("string");
    }
  } else {
    expect(response.body).toHaveProperty("message");
  }
};

module.exports = { assertStandardResponse };
