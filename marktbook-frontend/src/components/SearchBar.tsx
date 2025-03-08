import { InputGroup, Form, DropdownButton, Dropdown } from 'react-bootstrap'
import '@styles/search-bar.scss'

interface SearchProps {
  value?: string;
  onSelect: (e: string | null) => void;
  eventKeys: string[];
  useField: {
    name: string;
    value: string | number;
    type: string;
    onChange: (event: React.FormEvent) => void;
    required: boolean;
  };
  handleSearch: (searchPhrase: string) => void;
  reset: () => void;
}

const SearchBar = ({ value = 'Select', onSelect, eventKeys, useField, handleSearch, reset }: SearchProps) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    useField.onChange(event)
    handleSearch(event.target.value)
  }

  const handleReset = () => {
    handleSearch('')
    reset()
  }

  return (
    <InputGroup className="mb-3">
      <Form.Control
        aria-label="Text input with dropdown button"
        placeholder={`Search by ${value}...`}
        autoFocus
        {...useField}
        onChange={handleInputChange}
      />
      {useField.value &&
      <span className='reset' onClick={handleReset}>&times;</span>}
      <DropdownButton
        variant="outline-secondary"
        title={value}
        id="input-group-dropdown-2"
        align="end"
        onSelect={onSelect}
      >
        {eventKeys.map(eventKey => (
          <Dropdown.Item key={eventKey} eventKey={eventKey}>
            {eventKey}
          </Dropdown.Item>
        ))}
      </DropdownButton>
    </InputGroup>
  )
}

export default SearchBar