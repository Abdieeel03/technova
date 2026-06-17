import { useEffect, useMemo, useReducer, useState } from "react";
import CarritoContext from "../context/CarritoContext";
import { cartReducer, initialState } from "../reducers/carritoReducer";
import { loadCarrito, saveCarrito } from "../services/carritoStorage";

export default function CarritoProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState, (baseState) =>
    loadCarrito(baseState),
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    saveCarrito(state);
  }, [state]);

  const { totalItems, totalPrice } = useMemo(() => {
    return state.items.reduce(
      (acc, item) => {
        acc.totalItems += item.cantidad;
        acc.totalPrice += item.precioUnitario * item.cantidad;
        return acc;
      },
      { totalItems: 0, totalPrice: 0 },
    );
  }, [state.items]);

  const value = useMemo(
    () => ({
      items: state.items,
      meta: state.meta,
      totalItems,
      totalPrice,
      isModalOpen,
      openModal: () => setIsModalOpen(true),
      closeModal: () => setIsModalOpen(false),
      addItem: (producto, cantidad = 1) =>
        dispatch({ type: "ADD_ITEM", payload: { producto, cantidad } }),
      updateItemQty: (id, cantidad) =>
        dispatch({ type: "UPDATE_QTY", payload: { id, cantidad } }),
      removeItem: (id) => dispatch({ type: "REMOVE_ITEM", payload: id }),
      clearCart: () => dispatch({ type: "CLEAR_CART" }),
      setCartOwner: (userId) =>
        dispatch({ type: "SET_OWNER", payload: userId }),
    }),
    [state.items, state.meta, totalItems, totalPrice, isModalOpen],
  );

  return (
    <CarritoContext.Provider value={value}>{children}</CarritoContext.Provider>
  );
}