import jwt from 'jsonwebtoken';

export const genTokenAndSetCookie = async (userId, res) => {
  try {
    const token = await jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1d' });

   
    res.cookie('job-token', token, {
      expires: new Date(Date.now() + 86400000),
      httpOnly: true,
      sameSite: 'strict' 
    });

    return token;
  } catch (error) {
    console.error('Error generating token and setting cookie:', error);
    throw new Error('Token generation failed');
  }
};
