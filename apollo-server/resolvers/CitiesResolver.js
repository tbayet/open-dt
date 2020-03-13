import City from '../entities/CityEntity'

const Query = {
  city: (root, { lat, long }) => City.getOne({ lat, long }),
  cities: (root, args = {}) => City.getValues(args),
}

export default {
  Query,
}
