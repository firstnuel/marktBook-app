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
      image_url: 'https://img.freepik.com/free-psd/key-icon_187299-39345.jpg?t=st=1733929336~exp=1733932936~hmac=ab1fa4eed298e19d8df48a702439a115ca201c6c8741ba7f6ef28f247b362825&w=1380'
    })
  }
}


export const resetPasswordTemplate: ResetPasswordTemplate = new ResetPasswordTemplate()