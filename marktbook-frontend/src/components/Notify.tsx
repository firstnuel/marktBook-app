import '@styles/notify.scss'

interface NotifyProps {
    error?: string | null,
    success?:string | null,
    clearFn: () => void,
}

interface NotifyBoxProps {
    error?: string | null ,
    success?:string | null,
    clearErrFn: () => void,
}

export const NotifyError = ({ error, clearFn }: NotifyProps) => {

  return (
    <>
      {error && error.length > 0 && (
        <div className="notify-error-div" >
          <div className="error-msg">{error}</div>
          <div className="clear-err-btn" onClick={() => clearFn()}> &times;</div>
        </div>
      )}
    </>
  )
}

export const NotifySuccess = ({ success, clearFn }: NotifyProps) => {

  return (
    <>
      {success && success.length > 0 && (
        <div className="notify-success-div">
          <div className="success-msg">{success}</div>
          <button className="clear-success-btn" onClick={() => clearFn()}> &times;</button>
        </div>
      )}
    </>
  )
}

const Notify = ({ error, success, clearErrFn }: NotifyBoxProps) => {


  return(
    <div className="notify-box">
      <NotifySuccess success={success} clearFn={clearErrFn}/>
      <NotifyError error={error} clearFn={clearErrFn} />
    </div>
  )
}

export default Notify

