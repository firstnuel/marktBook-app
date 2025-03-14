import fs from 'fs' 
import ejs from 'ejs'

class ForgotPasswordTemplate {
  public passwordResetTemplate(username: string, resetLink: string): string {
    return ejs.render(fs.readFileSync(__dirname + '/templates/forgot-password-template.ejs', 'utf8'), {
      username,
      resetLink,
      image_url: 'https://res.cloudinary.com/dwinebv1e/image/upload/v1739744822/plh6xhpaweabfpxn6w9k.jpg'
    })
  }
}


export const forgotPasswordTemplate: ForgotPasswordTemplate = new ForgotPasswordTemplate()

