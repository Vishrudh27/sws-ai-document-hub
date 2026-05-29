function UploadQueue() {

  const files = [
    {
      name: "Document1.docx",
      size: "2.9 MB"
    },
    {
      name: "Model_SS.pdf",
      size: "3.9 MB"
    }
  ];

  return (
    <div className="mt-8">

      <div className="flex justify-between mb-4">
        <h2 className="font-semibold text-lg">
          Upload Queue
        </h2>

        <button className="text-gray-500">
          Clear all
        </button>
      </div>

      <div className="space-y-4">

        {files.map((file, index) => (
          <div
            key={index}
            className="bg-green-50 border border-green-200 rounded-2xl p-5 flex justify-between"
          >
            <div>
              <h3 className="font-medium">
                {file.name}
              </h3>

              <p className="text-green-600 text-sm">
                Upload complete
              </p>
            </div>

            <div className="text-gray-500">
              {file.size}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UploadQueue;
