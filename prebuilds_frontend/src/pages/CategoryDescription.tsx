interface Props {
  description: string;
  pageTitle: string | undefined;
}

const CategoryDescription = ({ description, pageTitle }: Props) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md mb-4 max-w-7xl mx-auto mt-4">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">{pageTitle}</h2>
      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{description}</p>
    </div>
  );
};

export default CategoryDescription;
