import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { useEffect, useState } from 'react'
import '@styles/categories.scss'
import { ProductCategory } from '@typess/pos'
import { useBusiness } from '@hooks/useBusiness'
import { useField } from '@hooks/useField'
import Notify from '@components/Notify'
import { useInv } from '@hooks/useInv'

const Categories = () => {
  const [show, setShow] = useState(false)
  const { business, update } = useBusiness()
  const { setSubOpt, fetchProductsByCat, successMsg, success, error, clearError } = useInv()
  const { reset, ...category } = useField('category', 'text')
  const [inputError, setInputError] = useState(false)


  const getProductsByCat = (category: string) => {
    fetchProductsByCat(category)
  }

  useEffect(() => {
    if(success) {
      setSubOpt('Product By Cat')
    }
  }, [success, setSubOpt])

  const handleSubmit = () => {
    if((category.value as string).length) {
      const data = business?.customCategories
        ? [...business.customCategories, category.value as string]
        : [category.value as string]
      update(business!._id, { customCategories: data })
      if(success)
        reset()
      setShow(false)
    } else {
      setInputError(true)
      const timer  = setTimeout(() => setInputError(false), 3000)
      return () => clearTimeout(timer)
    }
  }
  const handleShow = () => setShow(true)
  const categoryData = business?.customCategories?.length ?
    [...business!.customCategories, ...Object.values(ProductCategory)] : Object.values(ProductCategory)

  const checkType = (category: string): string => {
    if ((Object.values(ProductCategory) as string[]).includes(category)) {
      return 'Default'
    }
    return 'Custom'
  }

  return(
    <Container className="whole">
      <Notify clearErrFn={clearError} success={successMsg} error={error} />
      <div className="head-info">
        <div className="head-name">All Categories</div>
        <Button onClick={handleShow}>Add New Category</Button>
      </div>


      <Container className='table-container'>
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {categoryData.map((category, idx) => (
              <tr key={idx} onClick={() => getProductsByCat(category)}>
                <td>{category}</td>
                <td>{checkType(category)}</td>
              </tr>))
            }
          </tbody>
        </table>

      </Container>


      <Modal show={show}
        onHide={() => setShow(false)}
        backdrop="static"
        keyboard={false}
        centered >
        <Modal.Header closeButton>
          <Modal.Title>Create Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='cat-input'>
            <div>Category Name:
              {inputError && <span className="error">This field cannot be empty.</span>}
            </div>
            <Form.Control {...category} />
          </div>
        </Modal.Body>
        <Modal.Footer id='cat-footer'>
          <Button variant="Success" onClick={handleSubmit}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default Categories