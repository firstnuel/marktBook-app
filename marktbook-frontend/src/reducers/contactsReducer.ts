import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { contactsService } from '@services/contactsService'
import { contactsState, Customer, Supplier } from '@typess/contacts'

const initialState: contactsState = {
  mainOpt: 'Customers',
  subOpt: 'None',
  loading: false,
  success: null,
  error: null,
  supplier: null,
  customer: null,
  suppliers: [],
  customers: []
}

export const fetchCustomers = createAsyncThunk('contacts/fetchCustomers', async () => {
  const response = await contactsService.fetchCustomers()
  if (!response.data) {
    throw new Error(response.message)
  }
  return { customers: response.data, message: response.message }
})

export const fetchCustomer = createAsyncThunk('contacts/fetchCustomer', async (customerId: string) => {
  const response = await contactsService.fetchCustomer(customerId)
  if (!response.data) {
    throw new Error(response.message)
  }
  return { customer: response.data, message: response.message }
})

export const fetchSuppliers = createAsyncThunk('contacts/fetchSuppliers', async () => {
  const response = await contactsService.fetchSuppliers()
  if (!response.data) {
    throw new Error(response.message)
  }
  return { suppliers: response.data, message: response.message }
})

export const fetchSupplier = createAsyncThunk('contacts/fetchSupplier', async (supplierId: string) => {
  const response = await contactsService.fetchSupplier(supplierId)
  if (!response.data) {
    throw new Error(response.message)
  }
  return { supplier: response.data, message: response.message }
})

export const updateCustomer = createAsyncThunk(
  'contacts/updateCustomer',
  async ({ customerId, data }: { customerId: string; data: Partial<Customer> }) => {
    const response = await contactsService.updateCustomers(customerId, data)
    if (!response.data) {
      throw new Error(response.message)
    }
    return { customer: response.data, message: response.message }
  }
)

export const updateSupplier = createAsyncThunk(
  'contacts/updateSupplier',
  async ({ supplierId, data }: { supplierId: string; data: Partial<Supplier> }) => {
    const response = await contactsService.updateSupplier(supplierId, data)
    if (!response.data) {
      throw new Error(response.message)
    }
    return { supplier: response.data, message: response.message }
  }
)

export const deleteCustomer = createAsyncThunk('contacts/deleteCustomer', async (customerId: string) => {
  const response = await contactsService.deleteCustomer(customerId)
  if (response.status !== 'success') {
    throw new Error(response.message)
  }
  return { customerId, message: response.message }
})

export const deleteSupplier = createAsyncThunk('contacts/deleteSupplier', async (supplierId: string) => {
  const response = await contactsService.deleteSupplier(supplierId)
  if (response.status !== 'success') {
    throw new Error(response.message)
  }
  return { supplierId, message: response.message }
})


const contactSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
      state.success = null
    },
    setMainOpt: (state, action) => {
      state.mainOpt = action.payload.option
    },
    setSubOpt: (state, action) => {
      state.subOpt = action.payload.option
    },
    rmContacts: (state) => {
      state.customer = null
      state.supplier = null
      state.subOpt = 'None'
    },
  },
  extraReducers: (builder) => {
    // Fetch Customers
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true
        state.success = null
        state.error = null
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.customers = action.payload.customers
        state.success = action.payload.message
        state.loading = false
        state.error = null
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false
        state.success = null
        state.error = action.error.message || 'Customer data could not be fetched, try again later'
      })

    // Fetch Customer
    builder
      .addCase(fetchCustomer.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = null
      })
      .addCase(fetchCustomer.fulfilled, (state, action) => {
        state.customer = action.payload.customer
        state.success = action.payload.message
        state.loading = false
        state.error = null
      })
      .addCase(fetchCustomer.rejected, (state, action) => {
        state.loading = false
        state.success = null
        state.error = action.error.message || 'Customer details could not be fetched'
      })

    // Fetch Suppliers
    builder
      .addCase(fetchSuppliers.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = null
      })
      .addCase(fetchSuppliers.fulfilled, (state, action) => {
        state.suppliers = action.payload.suppliers
        state.success = action.payload.message
        state.loading = false
        state.error = null
      })
      .addCase(fetchSuppliers.rejected, (state, action) => {
        state.loading = false
        state.success = null
        state.error = action.error.message || 'Suppliers data could not be fetched'
      })

    // Fetch Supplier
    builder
      .addCase(fetchSupplier.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = null
      })
      .addCase(fetchSupplier.fulfilled, (state, action) => {
        state.supplier = action.payload.supplier
        state.success = action.payload.message
        state.loading = false
        state.error = null
      })
      .addCase(fetchSupplier.rejected, (state, action) => {
        state.loading = false
        state.success = null
        state.error = action.error.message || 'Supplier details could not be fetched'
      })

    // Update Customer
    builder
      .addCase(updateCustomer.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = null
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.customer = action.payload.customer
        state.success = action.payload.message
        state.loading = false
        state.error = null
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.loading = false
        state.success = null
        state.error = action.error.message || 'Failed to update customer'
      })

    // Update Supplier
    builder
      .addCase(updateSupplier.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = null
      })
      .addCase(updateSupplier.fulfilled, (state, action) => {
        state.supplier = action.payload.supplier
        state.success = action.payload.message
        state.loading = false
        state.error = null
      })
      .addCase(updateSupplier.rejected, (state, action) => {
        state.loading = false
        state.success = null
        state.error = action.error.message || 'Failed to update supplier'
      })

    // Delete Customer
    builder
      .addCase(deleteCustomer.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = null
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.customers = state.customers.filter((cust) => cust._id !== action.payload.customerId)
        state.success = action.payload.message
        state.loading = false
        state.error = null
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.loading = false
        state.success = null
        state.error = action.error.message || 'Failed to delete customer'
      })

    // Delete Supplier
    builder
      .addCase(deleteSupplier.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = null
      })
      .addCase(deleteSupplier.fulfilled, (state, action) => {
        state.suppliers = state.suppliers.filter((supp) => supp._id !== action.payload.supplierId)
        state.success = action.payload.message
        state.loading = false
        state.error = null
      })
      .addCase(deleteSupplier.rejected, (state, action) => {
        state.loading = false
        state.success = null
        state.error = action.error.message || 'Failed to delete supplier'
      })
  },
})

export const { clearError, setMainOpt, setSubOpt, rmContacts } = contactSlice.actions
export default contactSlice.reducer
