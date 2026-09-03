import api from '../../api/axios'

export const obtainCategories = () => {
  return api.get('/categories/list').catch(() => api.get('/categories'))
}