import { motion } from 'motion/react';

interface Category {
  id: number;
  name: string;
  imageUrl: string;
}

interface CategoryExplorationProps {
  categories: Category[];
}

export function CategoryExploration({ categories }: CategoryExplorationProps) {
  return (
    <section className="py-20 px-6 lg:px-12 bg-gray-50">
      <div className="max-w-[1600px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl mb-2 tracking-tight">Shop by Category</h2>
          <p className="text-gray-600">Explore our curated collections</p>
        </motion.div>

        {/* Masonry Grid Layout */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              className={`group cursor-pointer relative overflow-hidden ${
                index === 0 || index === 3 ? 'md:row-span-2' : ''
              }`}
            >
              <div className="relative h-full min-h-[300px] overflow-hidden">
                <motion.img
                  src={category.imageUrl}
                  alt={category.name}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
                
                {/* Desaturate and darken on hover */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 bg-black/30"
                />

                {/* Category Label */}
                <div className="absolute inset-0 flex items-end p-6">
                  <motion.div
                    initial={{ y: 0 }}
                    whileHover={{ y: -8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-white text-2xl tracking-tight uppercase">
                      {category.name}
                    </h3>
                    <motion.div
                      className="h-0.5 bg-white mt-2"
                      initial={{ width: 0 }}
                      whileHover={{ width: '60px' }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}