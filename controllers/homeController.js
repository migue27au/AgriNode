export const getHome = async (req, res) => {
  res.json({
    status: 200,
    error: '',
    message: 'OK',
    data: { message: 'Hello from AgriNode' }
  });
};
