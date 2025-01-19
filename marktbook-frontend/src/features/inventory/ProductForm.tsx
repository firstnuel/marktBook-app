import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import '@styles/view-edit.scss'
import InputGroup from 'react-bootstrap/InputGroup'
import { IProduct } from '@typess/inv'
import { useField } from '@hooks/useField'
import { Unit } from '@typess/inv'
import { ProductCategory, ProductType } from '@typess/pos'
import {  useState } from 'react'
import IconBox from '@components/IconBox'
import icons from '@assets/icons'
import { useInv } from '@hooks/useInv'

interface ProductForm {
  product?: IProduct
  error: string
}

const ProductForm = ({ product, error }: ProductForm) => {
  const { reset: nameReset, ...productName } = useField('productName', 'text', product?.productName?? '')
  const { reset: barcodeReset, ...barcode } = useField('barcode', 'text', product?.barcode?? '')
  const { reset: tagReset, ...productTag } = useField('productTag', 'text')
  const { reset: shortDesReset, ...shortDes } = useField('shortDescription', 'text', product?.shortDescription?? '')
  const { reset: longDesReset, ...longDes } = useField('longDescription', '', product?.longDescription?? '')
  const { reset: basePriceReset, ...basePrice } = useField('basePrice', 'text', product?.basePrice?? '')
  const { reset: discountReset, ...discount } = useField('discount', 'text', product?.discount?.toString() ?? '')
  const { reset: colorReset, ...color } = useField('color', 'text', product?.attributes?.color?? '')
  const { reset: sizeReset, ...size } = useField('size', 'number', product?.attributes?.size?? '')
  const { reset: brandReset, ...brand } = useField('brand', 'text', product?.attributes?.brand?? '')
  const { reset: manufacturerReset, ...manufacturer } = useField('manufacturer', 'text', product?.attributes?.manufacturer?? '')
  const { reset: lengthReset, ...length } = useField('length', 'number', product?.attributes?.dimensions?.length?? '')
  const { reset: widthReset, ...width } = useField('width', 'number', product?.attributes?.dimensions?.width?? '')
  const { reset: heightReset, ...height } = useField('height', 'number', product?.attributes?.dimensions?.height?? '')
  const { reset: weightReset, ...weight } = useField('weight', 'number', product?.attributes?.dimensions?.weight?? '')

  const [selectedType, setSelectedType] = useState<string>(product?.productType?? '')
  const [selectedUnit, setSelectedUnit] = useState<string>(product?.unit?? '')
  const [selectedCat, setSelectedCat] = useState<string>(product?.productCategory?? '')
  const [tags, setTags] = useState(product?.tags?? [])
  const [image, setImage] = useState<string | ArrayBuffer | null>(null)
  const { resetOpt, updateProduct, success, loading } = useInv()


  const clearForm = () => {
    nameReset()
    barcodeReset()
    tagReset()
    shortDesReset()
    longDesReset()
    basePriceReset()
    discountReset()
    colorReset()
    sizeReset()
    brandReset()
    manufacturerReset()
    lengthReset()
    widthReset()
    heightReset()
    weightReset()
  }

  const addTags = (event: { key: string; preventDefault: () => void }) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      if (typeof productTag.value === 'string' && !tags.includes(productTag.value)) {
        setTags([...tags, productTag.value.trim()])
        tagReset()
      }
    }
  }
  const productData = {
    productName: productName.value,
    productCategory: selectedCat,
    sku: product?.sku,
    currency: product?.currency,
    productType: selectedType,
    businessId: product?.businessId,
    basePrice: parseInt(basePrice.value as string),
    discount: parseInt(discount.value as string),
    salePrice: parseInt(basePrice.value as string) - parseInt(discount.value as string),
    unit: selectedUnit,
    longDescription: longDes.value,
    shortDescription: shortDes.value,
    barcode: barcode.value,
    productImage: product?.productImage ? product?.productImage  : image || '',
    tags,
    attributes: {
      color: color.value,
      brand: brand.value,
      size:  parseInt(size.value as string) || 0,
      manufacturer: manufacturer.value,
      dimensions: {
        length: parseInt(length.value as string) || 0,
        width: parseInt(width.value as string) || 0,
        height: parseInt(height.value as string) || 0,
        weight: parseInt(weight.value as string) || 0
      }
    }
  }
  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      updateProduct(product!._id, productData as unknown as IProduct)
    } catch (err) {
      console.log(err)
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFileChange = (event: any) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }
  const handleUnitChange = (event: React.ChangeEvent<HTMLSelectElement>) => setSelectedUnit(event.target.value)
  const handleCatChange = (event: React.ChangeEvent<HTMLSelectElement>) => setSelectedCat(event.target.value)
  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => setSelectedType(event.target.value)

  return(
    <Container className='whole'>
      <div className="head-info">
        <div className="head-name">{
          product ? 'Edit Product' : 'Create Product'}</div>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{'Success'}</div>}
        <div className="action-btns">
          <div className="back" onClick={() => resetOpt()}>
            <IconBox src={icons.arrowback} clName='img-div'/>
            <span className="text">Back</span>
          </div>
          { product &&
            <Button variant="secondary">Stock Data</Button>
          }
        </div>
      </div>
      <Container className='form-content'>
        <Form className='form' onSubmit={handleEditSubmit} >
          <div className="product-name">
            <div className='name'> Product Name:</div>
            <Form.Control {...productName} />
          </div>
          <div className="sku-barcode">
            <div className="product-sku">
              { product?.sku?
                <><div>SKU: </div><div>{product.sku}</div></>
                :
                <><div>SKU: </div><InputGroup className="mb-3">
                  <Form.Control />
                  <Button variant="outline-secondary" id="button-addon2">
                  Generate SKU
                  </Button>
                </InputGroup></>
              }
            </div>
            <div className="product-barcode">
              <div> Bar Code:</div>
              <Form.Control {...barcode} required={false} />
            </div>
            <div className="product-unit">
              <div>Unit:</div>
              <Form.Select onChange={handleUnitChange} value={selectedUnit}>
                <option>Select Unit</option>
                {Object.values(Unit).map((unit, index) => (
                  <option value={unit} key={index}>{unit}</option>
                ))}
              </Form.Select>
            </div>
          </div>
          <div className="type-cat">
            <div className="product-cat">
              <div> Product Category:</div>
              <Form.Select onChange={handleCatChange} value={selectedCat}>
                <option value="Cat">Select Category</option>
                {Object.values(ProductCategory).map((category, index) => (
                  <option value={category} key={index}>{category}</option>
                ))}
              </Form.Select>
            </div>
            <div className="product-type">
              <div> Product Type:</div>
              <Form.Select onChange={handleTypeChange} value={selectedType} >
                <option value="type">Select Type</option>
                {Object.values(ProductType).map((category, index) => (
                  <option value={category} key={index}>{category}</option>
                ))}
              </Form.Select>
            </div>
          </div>
          <div className="product-short-des">
            <div> Short Description:</div>
            <Form.Control {...shortDes} maxLength={100}/>
          </div>
          <div className="product-long-des">
            <div> Long Description:</div>
            <Form.Control {...longDes} as="textarea" rows={3} />
          </div>
          <div className="price">
            <div className="base-price">
              <div> Base Price:</div>
              <Form.Control {...basePrice}  />
            </div>
            <div className="price-discount">
              <div>Discount:</div>
              <Form.Control {...discount} required={false} />
            </div>
          </div>
          <div className="product-img">
            <div className='file'> Product Image:
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required={false}
              />
            </div>
            { product?.productImage && (
              <div className="img-div">
                <img
                  src={product?.productImage}
                  alt="Product"
                />
              </div>
            )}
          </div>

          <div className="attributes">
            <div className="attr-color">
              <div> Color:</div>
              <Form.Control {...color}
                required={false}/>
            </div>
            <div className="attr-size">
              <div> Size:</div>
              <Form.Control {...size}
                required={false}/>
            </div>
            <div className="attr-brand">
              <div> Brand:</div>
              <Form.Control {...brand}
                required={false}/>
            </div>
            <div className="attr-manu">
              <div> Manufacturer:</div>
              <Form.Control {...manufacturer}
                required={false}/>
            </div>
          </div>

          <div className="dimensions">
            <div className="dim-length">
              <div>Length:</div>
              <Form.Control {...length} required={false}/>
            </div>
            <div className="dim-width">
              <div>Width:</div>
              <Form.Control {...width} required={false}/>
            </div>
            <div className="dim-height">
              <div> Height:</div>
              <Form.Control {...height} required={false}/>
            </div>
            <div className="dim-weight">
              <div> Weight:</div>
              <Form.Control {...weight} required={false}/>
            </div>
          </div>

          <div className="tags">
            <div className="tags-select">
              <div> Select Tags:</div>
              <Form.Control {...productTag}
                onKeyDown={addTags}
                placeholder='Press Enter to add'
                required={false} />
            </div>
            <div className="selected-tags">
              <div> Selected Tags:</div>
              <div>{tags.join(', ')}</div>
            </div>
          </div>
          <div className="form-btns-div">
            <Button variant="primary" type='submit' disabled={loading}>
              {product ?
                loading ? 'Saving' : 'Save Changes'
                :
                loading ? 'Creating' : 'Create Product'}
            </Button>
            {!product && <Button variant="danger" onClick={clearForm}>
                Clear Form
            </Button>}
            { product &&
            <Button variant="danger">Delete</Button>
            }
          </div>
        </Form>
      </Container>
    </Container>
  )
}

export default ProductForm