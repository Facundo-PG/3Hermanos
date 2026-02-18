# Componentes de Orders

Esta carpeta contiene los componentes relacionados con la gestión de pedidos.

## Estructura

- **TableOrders.vue** - Componente padre que muestra la tabla de pedidos
- **OrderActions.vue** - Botones de acción (editar/eliminar) para cada pedido
- **OrderEditDialog.vue** - Modal para editar un pedido
- **OrderDeleteDialog.vue** - Modal de confirmación para eliminar un pedido

## Uso

```vue
<TableOrders
  :pedidos="pedidos"
  :search="search"
  :loading="loading"
  @edit="handleEdit"
  @delete="handleDelete"
/>
```
