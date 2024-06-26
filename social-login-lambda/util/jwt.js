import jwt from "jsonwebtoken";

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const generateToken = async (user) => {
  //jwt.sign(payload, secretKey, [options, callback])
  const token = jwt.sign(
    {
      type: "JWT",
      displayName: user.displayName,
      socialEmail: user.socialEmail,
    },
    JWT_SECRET_KEY,
    {
      expiresIn: "5h",
      issuer: "iampam.io",
    }
  );
  return token;
};

// const userToken = req.headers["Authorization"]?.split(" ")[1];
const verifyToken = async (token) => {
  console.log("verifyToken-token", token);
  try {
    const jwtDecoded = jwt.verify(token, JWT_SECRET_KEY);
    console.log("jwtDecoded", jwtDecoded);
    return jwtDecoded;
  } catch (error) {
    throw error;
  }
};

// // 기존 토큰을 사용하여 새로운 토큰을 생성하는 함수
// const refreshToken = async (token) => {
//   try {
//     // 기존 토큰의 유효성 검사 및 디코딩
//     const decoded = jwt.verify(token, JWT_SECRET_KEY);

//     // 새로운 페이로드 생성
//     console.log(JSON.stringify(decoded));
//     const payload = {
//       userId: decoded.userId,
//       isAdmin: decoded.isAdmin,
//     };

//     // 새로운 토큰 생성
//     const newToken = generateToken(payload);
//     return newToken;
//   } catch (error) {
//     // 토큰 새로 고침 중 오류 발생 시 출력
//     console.error("Error refreshing token:", error);
//     return null;
//   }
// };

// // JWT 토큰을 새로 고치는 미들웨어 함수
// const refreshJwtMiddleware = (req, res, next) => {
//   const token = req.cookies.token;
//   if (token) {
//     const newToken = refreshToken(token);
//     if (newToken) {
//       res.cookie("token", newToken, { httpOnly: true, maxAge: 3600000 });
//     }
//   }
//   next();
// };

export { generateToken, verifyToken };
