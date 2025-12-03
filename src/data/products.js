// Adaptador de compatibilidad: reexporta la API desde data/catalog

import { list as _list } from "./catalog";

export {
  list,
  create,
  update,
  remove,
  getByCode,
  saveList,
  incStock,
  decStock,
  listCategories,
  listOffers,
} from "./catalog";

// Snapshot usado por módulos antiguos (PRODUCTS)
const PRODUCTS = _list();
export default PRODUCTS;
