import Container from 'react-bootstrap/Container'
import { ActionType } from '@typess/logs'

interface LogBoxProps {
  username: string;
  description: string;
  dateTime: string;
  actionType: ActionType;
  fe? : boolean
}

const LogBox: React.FC<LogBoxProps> = ({ username, description, dateTime, actionType, fe }) => {
  return (
    <Container className={`log-con ${fe? 'fe': ''}`}>
      <div className="info">
        <div className="username">@{username}</div>
        <div className="description">{description}</div>
        <div className="date-time">{dateTime}</div>
      </div>
      <div className="action">
        <div className={`action-div ${actionType}`}>{actionType}</div>
      </div>
    </Container>
  )
}

export default LogBox
