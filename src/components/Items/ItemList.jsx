import { useState, useEffect } from 'react';
import api from '../../services/api';
import Loading from '../Loading';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const response = await api.get('/items'); // Substitua pelo seu endpoint
        setItems(response.data);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Erro ao buscar itens.');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  return (
    <div>
      <h2>Lista de Itens</h2>
      {loading ? (
        <Loading />
      ) : (
        <ul>
          {items.map((item) => {
            return <li key={item.id}>{item.nome}</li>; // Adapte conforme a estrutura do seu item
          })}
        </ul>
      )}
    </div>
  );
};

export default ItemList;