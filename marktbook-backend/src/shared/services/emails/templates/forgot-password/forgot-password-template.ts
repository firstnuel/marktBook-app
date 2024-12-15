import fs from 'fs' 
import ejs from 'ejs'

class ForgotPasswordTemplate {
  public passwordResetTemplate(username: string, resetLink: string): string {
    return ejs.render(fs.readFileSync(__dirname + '/forgot-password-template.ejs', 'utf8'), {
      username,
      resetLink,
      image_url: 'https://img.freepik.com/free-psd/key-icon_187299-39345.jpg?t=st=1733929336~exp=1733932936~hmac=ab1fa4eed298e19d8df48a702439a115ca201c6c8741ba7f6ef28f247b362825&w=1380'
    })
  }
}


export const forgotPasswordTemplate: ForgotPasswordTemplate = new ForgotPasswordTemplate()

