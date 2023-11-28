// app.mjs

const express = require('express');
// eslint-disable-next-line import/no-extraneous-dependencies
const { PrismaClient } = require('@prisma/client');
// const set = require('date-fns/set');
const bodyParser = require('body-parser');

const prisma = new PrismaClient();
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

app.get('/', async (req, res) => {
  res.status(200).json({
    message: 'Hello world!',
  });
});

app.post('/api/youtrack/tasks', async (req, res) => {
  const request = req.body;

  let systemId;
  let projectId;
  let taskNew;

  try {
    const system = await prisma.systems.findFirst({
      where: {
        name: request.system,
      },
    });

    if (system <= 0) {
      systemId = await prisma.systems.create({
        data: {
          name: request.system,
        },
      });
      systemId = systemId.id;
    } else {
      systemId = system.id;
    }

    const project = await prisma.projects.findFirst({
      where: {
        name: request.project,
      },
    });

    if (project <= 0) {
      projectId = await prisma.projects.create({
        data: {
          name: request.project,
          shorthand: request.projectShorthand,
        },
      });
      projectId = projectId.id;
    } else {
      projectId = project.id;
    }

    const task = await prisma.tasks.findFirst({
      where: {
        task_id: request.task_id,
      },
    });

    if (task) {
      console.log(task.id);
    } else {
      console.log('no task');
    }
    
    if (!task) {
      const { created, resolved } = request;
      const createdISO = new Date(created).toISOString();

      let resolvedISO;
      if (resolved) {
        resolvedISO = new Date(resolved).toISOString();
      } else {
        resolvedISO = null;
      }

      taskNew = await prisma.tasks.create({
        data: {
          system_id: systemId,
          project_id: projectId,
          task_id: request.task_id,
          title: request.title,
          description: request.description,
          created_timestamp: createdISO,
          resolved_timestamp: resolvedISO,
        },
      });
    } else if (task) {
      const { created, resolved } = request;
      const createdISO = new Date(created).toISOString();
      const dateNow = `${new Date().toISOString().slice(0, 19)}Z`;
      console.log(dateNow + createdISO);
      let resolvedISO;
      if (resolved) {
        resolvedISO = new Date(resolved).toISOString();
      } else {
        resolvedISO = null;
      }

      const taskUpdate = await prisma.tasks.update({
        where: {
          id: task.id,
        },
        data: {
          title: request.title,
          description: request.description,
          created_timestamp: createdISO,
          resolved_timestamp: resolvedISO,
          updated_at: dateNow,
        },
      });
    }

    return res.status(200).json({
      message: 'success',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Internal Server Error',
    });
  }
});

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`🚀 Development is running on port ${PORT}.`);
  console.log(process.env);
});
