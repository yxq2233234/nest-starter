export const businessErrorInfos = {
  userNotFound: { errorCode: 201, httpStatus: 404, message: '未找到用户' },
  userAlreadyExists: { errorCode: 202, httpStatus: 400, message: '用户已存在' },
  invalidPassword: { errorCode: 203, httpStatus: 400, message: '密码不匹配' },
};
