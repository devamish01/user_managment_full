import { memo, useEffect, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

type Todo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

const API_URL = "https://jsonplaceholder.typicode.com/todos";

type TodoRowProps = {
  item: Todo;
  start: number;
  size: number;
};

const TodoRow = memo(({ item, start, size }: TodoRowProps) => {
  // console.log("TodoRow render:", item.id);

  return (
    <div
      data-index={item.id}
      className="todo-row"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        minHeight: `${size}px`,
        transform: `translateY(${start}px)`,
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <p>
        {item.id} = {item.title}
      </p>

      <div
        style={{
          borderBottom: "1px solid #eee",
        }}
      >
        User: {item.userId} | Status: {item.completed ? "Completed" : "Pending"}
      </div>
    </div>
  );
});

TodoRow.displayName = "TodoRow";

export const UserList = () => {
  const [list, setList] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const filteredList = list.filter((item)=> {
    const query = debouncedSearch.toLowerCase();
    return (
      item.title.toLowerCase().includes(query) ||
      item.id.toString().includes(query) ||
      item.userId.toString().includes(query) ||
      (item.completed? "completed" : "pending").includes(query)
    );
  });
 
  // const filteredList = list.filter((item) =>
  //   item.title.toLowerCase().includes(debouncedSearch.toLowerCase())
  // );

  // const parentRef = useRef<HTMLDivElement>(null);
  const parentRef = useRef(null);

  // Prevent duplicate request

  useEffect(() => {
    const controller = new AbortController();

    const fetchList = async () => {
 


      try {
        setLoading(true);
        setError(null);

        const response = await fetch(API_URL, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch todos");
        }

        const data: Todo[] = await response.json();

        setList(data);
      } catch (error) {
        // Abort error ko actual error mat samjho
        if ((error as Error).name === "AbortError") {
          return;
        }

        console.error(error);

        setError("Failed to load todos");
        setList([]);
      } finally {

        // Component unmount ho chuka ho to state update avoid
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchList();

    // Cleanup previous request
    return () => {
      controller.abort();
    };
  }, []);

  const rowVirtualizer = useVirtualizer({
    count: filteredList.length,

    // Actual scrolling element
    getScrollElement: () => parentRef.current,

    // Initial estimated row height
    estimateSize: () => 70,

    // Extra rows around viewport
    overscan: 5,

    // Stable item identity
    getItemKey: (index) => filteredList[index]?.id ?? index,
  });

  // DOM count debugging
  useEffect(() => {
    console.log("DOM rows:", document.querySelectorAll(".todo-row").length);
  });

  console.count("UserList render");
  console.log("error", error);

  if (loading) {
    return (
      <div>
        <h2>Todo List</h2>
        <p>Loading todos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2>Todo List</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (list.length === 0) {
    return (
      <div>
        <h2>Todo List</h2>
        <p>No todos found.</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Todo List</h2>

      <p>Total records: {list.length}</p>
       <p>Total filteredList records: {filteredList.length}</p>
      <div>
        <input
          style={{ boxSizing: "border-box", border: "1px solid #eee" }}
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search todos..."
        />

      </div>
      {filteredList.length === 0 && <p>No todos match your search.</p>}
      <div
        ref={parentRef}
        style={{
          boxSizing: "border-box",
          borderBottom: "1px solid #eee",
          overflow: "auto",
          height: "700px",
        }}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const item = filteredList[virtualRow.index];

            return (
              <TodoRow
                key={virtualRow.key}
                item={item}
                start={virtualRow.start}
                size={virtualRow.size}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
