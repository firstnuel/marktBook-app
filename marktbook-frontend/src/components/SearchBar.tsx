import { InputGroup, Form, DropdownButton, Dropdown } from 'react-bootstrap'

interface SearchProps {
    value?: string;
    onSelect: (e: string | null )=>void;
    eventKeys: string[];
    useField: {
        name: string;
        value: string;
        type: string;
        onChange: (event: React.FormEvent) => void;
        required: boolean;
    }

}




const SearchBar = ({ value='', onSelect, eventKeys, useField }: SearchProps) => (
  <InputGroup className="mb-3">
    <Form.Control aria-label="Text input with dropdown button"
      placeholder={`Search by ${value}...`} autoFocus
      { ...useField }
    />
    <DropdownButton variant="outline-secondary"
      title={value}
      id="input-group-dropdown-2"
      align="end"
      onSelect={onSelect}
    >
      {eventKeys.map(eventKey => (
        <Dropdown.Item key={eventKey} eventKey={eventKey}>{eventKey}</Dropdown.Item>
      ))}

    </DropdownButton>
  </InputGroup>

)



export default SearchBar