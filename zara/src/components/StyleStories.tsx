import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

interface Story {
  id: number;
  title: string;
  subtitle: string;
  imageUrl: string;
}

interface StyleStoriesProps {
  stories: Story[];
}

export function StyleStories({ stories }: StyleStoriesProps) {
  return (
    <section className="py-20 px-6 lg:px-12 bg-white">
      <div className="max-w-[1600px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl mb-2 tracking-tight">Style Inspiration</h2>
          <p className="text-gray-600">Discover the stories behind our collections</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story, index) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative h-[500px] overflow-hidden mb-4 bg-gray-100">
                <motion.img
                  src={story.imageUrl}
                  alt={story.title}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />

                {/* Subtle Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Content Below Image */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + 0.3 }}
                className="space-y-2"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
                  {story.subtitle}
                </p>
                <h3 className="text-xl tracking-tight group-hover:text-gray-600 transition-colors">
                  {story.title}
                </h3>
                
                <motion.div
                  initial={{ x: 0 }}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center space-x-2 text-sm pt-2"
                >
                  <span className="uppercase tracking-wider">Read More</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}