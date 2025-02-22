import { useState } from 'react'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import IconBox from '@components/IconBox'
import icons from '@assets/icons'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { CSVLink } from 'react-csv'
import Caret from '@components/Caret'
import Loading from '@components/Spinner'
import Notify from '@components/Notify'
import { useStocks } from '@hooks/useStocks'
import { formatDate } from '@utils/helpers'
import { Location } from '@typess/stocks'
import NewLocation from './NewLocation'
import './index.scss'

const LocationTable = () => {
  const [show, setShow] = useState(false)
  const { locations, fetchLocations, loading, error, clearError, success } = useStocks()
  const [sort, setSort] = useState<{ key: keyof typeof hFields; dir: 'asc' | 'desc' }>({ key: 'Location Name', dir: 'asc' })

  const hFields: { [key: string]: keyof Location } = {
    'Location Name': 'locationName',
    'Location Type': 'locationType',
    Address: 'address',
    'Current Load': 'currentLoad',
    Capacity: 'capacity',
    Manager: 'manager',
    'Location Status': 'locationStatus',
    'Updated At': 'updatedAt',
  }

  const header = Object.keys(hFields)

  const handleHeaderClick = (header: string) => {
    setSort({
      key: header,
      dir: header === sort.key ? (sort.dir === 'asc' ? 'desc' : 'asc') : 'asc',
    })
  }

  const sortTable = (locations: Location[]) => {
    const field = hFields[sort.key]
    const direction = sort.dir === 'asc' ? 1 : -1

    return [...locations].sort((a, b) => {
      const aValue = a[field]
      const bValue = b[field]

      if (aValue !== undefined && bValue !== undefined) {
        if (aValue > bValue) return direction
        if (aValue < bValue) return -direction
      }
      return 0
    })
  }

  const sortedLocations = sortTable(locations)

  const exportToPDF = (print = false) => {
    const doc = new jsPDF('landscape')
    doc.text('Location List', 20, 10)
    autoTable(doc, {
      head: [header],
      body: locations.map(location => [
        location.locationName || '-',
        location.locationType || '-',
        location.address || '-',
        location.currentLoad || 0,
        location.capacity || 0,
        location.manager || '-',
        location.locationStatus || '-',
        formatDate(location.updatedAt) || '-',
      ]),
    })

    if (print) {
      window.open(doc.output('bloburl'), '_blank')
    } else {
      doc.save('location-list.pdf')
    }
  }

  const csvHeaders = Object.keys(hFields).map(label => ({ label, key: hFields[label] }))

  return (
    <>
      <Notify clearErrFn={clearError} success={success} error={error} />
      <div className="topper">
        <div className="top-menu">
          <div className="title-box">Location List</div>
          <div className="options" style={{ width: 'fit-content' }}>
            <IconBox clName="pdf" src={icons.pdf} onClick={() => exportToPDF(false)} />
            <CSVLink data={locations} headers={csvHeaders} filename="location-list.csv">
              <IconBox clName="excel" src={icons.excel} />
            </CSVLink>
            <IconBox clName="print" src={icons.print} onClick={() => exportToPDF(true)} />
            <IconBox clName="refresh" src={icons.refresh} onClick={() => fetchLocations()} />
            <Button onClick={() => setShow(true)}>New Location</Button>
          </div>
        </div>
      </div>
      <div className="main-content">
        {loading && <Loading />}
        <Table striped bordered hover>
          <thead>
            <tr>
              {header.map((headerItem, index) => (
                <th key={index} onClick={() => handleHeaderClick(headerItem)}>
                  <div className="th-con">
                    <span>{headerItem}</span>
                    {sort.key === headerItem && <Caret dir={sort.dir} />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedLocations.length > 0 ? (
              sortedLocations.map((location) => (
                <tr key={location.id} className='loca-row'>
                  <td>{location.locationName ?? '-'}</td>
                  <td>{location.locationType ?? '-'}</td>
                  <td>{location.address ?? '-'}</td>
                  <td>{location.currentLoad ?? '-'}</td>
                  <td>{location.capacity ?? '-'}</td>
                  <td>{location.manager ?? '-'}</td>
                  <td>{location.locationStatus ?? '-'}</td>
                  <td>{formatDate(location.updatedAt)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="no-user">No location found</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
      <NewLocation show={show} setShow={setShow}/>
    </>
  )
}

export default LocationTable
