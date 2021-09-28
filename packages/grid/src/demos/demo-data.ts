export const columns = [
  { name: 'name', title: 'Name', type: 'String', width: 400 },
  {
    name: 'category',
    title: 'Category',
    type: 'String',
    options: ['Storage', 'Computer', 'Other'],
  },
  { name: 'color', title: 'Color', type: 'String' },
  { name: 'price', title: 'Price', type: 'String', width: 150 },
];

export const records = [
  {
    id: 1,
    name: 'Hard disk',
    category: 'Storage',
    color: 'Red',
    price: 10,
  },
  {
    id: 2,
    name: 'PC',
    category: 'Computer',
    color: 'Black',
    price: 20,
  },
  {
    id: 3,
    name: 'Keyboard',
    category: 'Other',
    color: 'Orange',
    price: 15,
  },
  { id: 4, name: 'Laptop', category: 'Computer', color: 'Green', price: 13 },
  {
    id: 5,
    name: 'USB',
    category: 'Storage',
    color: 'Red',
    price: 180,
  },
  {
    id: 6,
    name: 'Macbook',
    category: 'Computer',
    color: 'Green',
    price: 24,
  },
  {
    id: 7,
    name: 'Wireless Keyboard',
    category: 'Other',
    color: 'White',
    price: 78,
  },
  { id: 8, name: 'Desktop', category: 'Computer', color: 'Green', price: 45 },
  {
    id: 9,
    name: 'Monitor',
    category: 'Other',
    color: 'Red',
    price: 88,
  },
  {
    id: 10,
    name: 'Cables',
    category: 'Other',
    color: 'Black',
    price: 98,
  },
];
