import { db } from '../utils/db'

class City {
  constructor(city) {
    this.city = city
    this.cityValue = city.value()
  }

  async update(values) {
    this.city
      .assign(values)
      .write()
    this.cityValue = this.city.value
  }

  get value() {
    return this.cityValue
  }
}

const getOne = async ({ lat, long }) => {
  let city = null
  if (lat && long) {
    city = await db.get('cities').find({ lat, long })
  }
  if (city) {
    return new City(city)
  }
  return null
}

const get = async (params) => {
  const cities = await db.get('cities').filter(params).value()
  return Promise.all(
    cities.map(async cityValue => {
      const city = await db.get('cities').find(cityValue)
      return new City(city)
    }),
  )
}

const getValues = async (params) => {
  const cities = await get(params)
  return cities.map(city => city.value)
}

const createOne = async ({
  country, name, lat, long,
}) => {
  await db.get('cities').push({
    country, name, lat, long,
  }).write()
  const city = await getOne({ lat, long })
  return city
}

const updateOne = async ({ lat, long }, values) => {
  if (lat && long) {
    const city = await getOne({ lat, long })
    if (city) {
      await city.update(values)
    }
    return city
  }
  return null
}

City.getOne = getOne
City.get = get
City.getValues = getValues
City.updateOne = updateOne
City.createOne = createOne

export default City
