import { categoryOf } from "../utils/categories";

export default function CategoryIcon({ categoryId, size = 40 }) {
  const cat = categoryOf(categoryId);
  return (
    <span
      className="cat-icon"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.5,
        background: `${cat.color}1f`,
      }}
    >
      {cat.emoji}
    </span>
  );
}
