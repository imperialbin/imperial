export default (res: any, message: string, code: number) => {
  res.status(code || 200).json({
    success: false,
    message,
  });
};
