/* eslint-disable @typescript-eslint/no-explicit-any */
import dotenv from 'dotenv'
import { faker } from '@faker-js/faker'
import axios from 'axios'
import { BusinessType, BusinessCategory } from './features/auth/interfaces/auth.interface'
import fs from 'fs/promises'
import path from 'path'

dotenv.config()

const saveToFile = async (data: object[], fileName: string): Promise<void> => {
  const filePath = path.resolve(__dirname, fileName)
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')
    console.log(`Seed data saved to ${filePath}`)
  } catch (error: any) {
    console.error(`Error saving data to file: ${error.message}`)
  }
}

const seedRegisterData = async (count: number): Promise<void> => {
  const generatedData: object[] = [] 
  try {
    for (let i = 0; i < count; i++) {
      const body = {
        username: faker.internet.username(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        adminFullName: faker.person.fullName(),
        businessName: faker.company.name(),
        businessType: faker.helpers.arrayElement(Object.values(BusinessType)),
        businessCategory: faker.helpers.arrayElement(Object.values(BusinessCategory)),
      }
      console.log(`****ADDING NEW USER AND BUSINESS TO DATABASE**** - ${i + 1} of ${count} ${body.username} - ${body.businessName}`)
      await axios.post(`${process.env.API_URL}/register`, body)
      generatedData.push(body) // Add the data to the array
    }

    // Save generated data to a file after the loop
    await saveToFile(generatedData, 'seed-data.json')
  } catch (error: any) {
    console.error(error?.response?.data || error.message)
  }
}

// Call the function with the desired count
seedRegisterData(3)
