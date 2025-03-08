import fs from 'fs' 
import ejs from 'ejs'


export interface IResetPasswordParams {
    username: string;
    email: string;
    ipaddress: string;
    date: string;
}

class ResetPasswordTemplate {
  public passwordResetConfirmationTemplate(templateParams: IResetPasswordParams): string {
    const { username, email, ipaddress, date} = templateParams
    return ejs.render(fs.readFileSync(__dirname + '/reset-password-template.ejs', 'utf8'), {
      username,
      email,
      ipaddress,
      date,
      image_url: 'https://res.cloudinary.com/dwinebv1e/image/upload/v1739744822/plh6xhpaweabfpxn6w9k.jpg'
    })
  }
}


export const resetPasswordTemplate: ResetPasswordTemplate = new ResetPasswordTemplate()