const MODELS = {
  NODE1: "com.axelor.project.db.Project",
  NODE2: "com.axelor.project.db.ProjectTask",
};

const records = [
  {
    id: 1,
    title: "Project 1",
    $key: `${MODELS.NODE1}:1`,
    _children: true,
    _droppable: true,
    tasks: [
      {
        name: "Analysis",
        progress: 100,
        id: 1,
        version: 0,
        title: "Analysis",
      },
      {
        name: "Design",
        progress: 20,
        id: 2,
        version: 0,
        title: "Design",
      },
      {
        _children: null,
        name: "Development",
        progress: 0,
        id: 3,
        version: 0,
        title: "Development",
      },
      {
        _children: null,
        name: "Launch",
        progress: 0,
        id: 4,
        version: 0,
        title: "Launch",
      },
      {
        _children: null,
        name: "Post Launch",
        progress: 0,
        id: 5,
        version: 0,
        title: "Post Launch",
      },
    ].map((item) => ({
      ...item,
      _draggable: true,
      $key: `${MODELS.NODE2}:${item.id}`,
    })),
  },
  {
    id: 2,
    title: "Project 2",
    _children: true,
    _droppable: true,
    $key: `${MODELS.NODE1}:2`,
    tasks: [
      { id: 105, title: "Design", progress: 5 },
      { id: 106, title: "Development", progress: 50 },
      { id: 107, title: "Follow-up", progress: 30 },
      { id: 108, title: "Implementation", progress: 20 },
      { id: 109, title: "Research", progress: 90 },
      { id: 110, title: "UI Design", progress: 45 },
    ].map((item) => ({
      ...item,
      _draggable: true,
      $key: `${MODELS.NODE2}:${item.id}`,
    })),
  },
];

export default records;
