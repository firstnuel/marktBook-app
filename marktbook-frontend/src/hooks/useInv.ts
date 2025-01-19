import { fetchProduct, setMainOpt, setSubOpt, resetOpt, updateProduct } from '@reducers/invReducer'
import { useAppDispatch, useAppSelector } from '../store'
import { IProduct } from '@typess/inv'

export const useInv = () => {
  const dispatch = useAppDispatch()
  const {
    mainOpt,
    subOpt,
    product,
    stock,
    error,
    loading,
    success
  } = useAppSelector(state => state.inv)


  return {
    mainOpt,
    subOpt,
    product,
    stock,
    success,
    error,
    loading,
    fetchProduct: (productId: string) => dispatch(fetchProduct(productId)),
    updateProduct: (productId: string, data: IProduct ) => dispatch(updateProduct({ productId, data })),
    setMainOpt: (option: string) => dispatch(setMainOpt({ option })),
    setSubOpt: (option: string) => dispatch(setSubOpt({ option })),
    resetOpt: () => dispatch(resetOpt())
  }
}