import bcrypt from "bcryptjs";
import speakeasy from "speakeasy";
import qrCode from "qrcode";
import jwt from "jsonwebtoken";
import User from "../models/user.js";


export const register = async (req, res) => {

    try{
      const {username, password} = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        username,
        password: hashedPassword,
        isMfaActive: false,
      });
      console.log("New User: ", newUser);
      await newUser.save();
      res.status(201).json({ message: "Kullanıcı başarıyla kaydedildi"});
    } catch (error) {
        res.status(500).json({ error: "Kullanıcı kaydedilirken hata oluştu", message: error});
    }

};
export const login = async (req, res) => {
  console.log("Kimliği doğrulanmış kullanıcı: ", req.user);
  res.status(200).json({
    message: "Kullanıcı başarıyla oturum açtı",
    username: req.user.username,
    isMfaActive: req.user.isMfaActive,
  });
};



export const authStatus = async (req, res) => {
  if(req.user){
    res.status(200).json({
      message: "Kullanıcı başarıyla oturum açtı",
      username: req.user.username,
      isMfaActive: req.user.isMfaActive,
    });
  } 
  else {
    res.status(401).json({message: "Kullanıcı bulunamadı"}); 
  }
};

export const logout = async (req, res) => {
  if(!req.user) 
  {
    res.status(401).json({message: "Kullanıcı bulunamadı"}); 
  }
  req.logout((err) => {
    if(err){
      return res.status(400).json({message: "Kullanıcı oturum açmadı"});
    }
    else {
      res.status(200).json({ message: "Çıkış başarılı"});
    }
  });
};


export const setup2FA = async (req, res) => {
  try {
    console.log("The req.user is : ", req.user);
    const user = req.user;
    var secret = speakeasy.generateSecret();
    console.log("The secret object is : ", secret);
    user.twoFactorSecret = secret.base32;
    user.isMfaActive = true;
    await user.save();
    const url = speakeasy.otpauthURL({
      secret: secret.base32,
      label: `${req.user.username}`,
      issuer: "berkayaytkn@gmail.com",
      encoding: "base32",
    });
    const qrImageUrl = await qrCode.toDataURL(url)
    res.status(200).json({
      secret: secret.base32,
      qrCode: qrImageUrl,
    });
  } catch (error) {
    res.status(500).json({ error: "2FA kurulumunda hata oluştu", message: error});
  }
};
export const verify2FA = async (req, res) => {

  const {token} = req.body;
  const user = req.user;

  const verified = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: "base32",
    token,
  });

  if(verified){
    const jwtToken = jwt.sign({username: user.username}, process.env.JWT_SECRET, { expiresIn: "1hr"});
    res.status(200).json({
      message: "2FA başarılı",
      token: jwtToken,
    });
  }
  else{
    res.status(400).json({
      message: "Geçersiz 2FA token"
    });
  }
};
export const reset2FA  = async (req, res) => {
  try {
    const user = req.user;
    user.twoFactorSecret = "";
    user.isMfaActive = false;
    await user.save();
    res.status(200).json({
      message: "2FA sıfırlama başarılı"
    });
  } catch (error) {
    res.status(500).json({ error: "2FA sıfırlanırken hata oluştu", message: error});
  }
};