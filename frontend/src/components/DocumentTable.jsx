function DocumentTable() {

  const docs = [
    {
      name: "Policy.pdf",
      size: "3.9 MB",
      time: "15:25"
    }
  ];

  return (
    <div className="mt-8 bg-white rounded-2xl border">

      <div className="p-6 border-b">
        <h2 className="font-semibold text-lg">
          Document Library
        </h2>
      </div>

      <table className="w-full">
        <thead>
          <tr className="text-left text-gray-500">
            <th className="p-4">NAME</th>
            <th className="p-4">SIZE</th>
            <th className="p-4">UPLOADED</th>
          </tr>
        </thead>

        <tbody>
          {docs.map((doc, index) => (
            <tr key={index} className="border-t">
              <td className="p-4">{doc.name}</td>
              <td className="p-4">{doc.size}</td>
              <td className="p-4">{doc.time}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

export default DocumentTable;
