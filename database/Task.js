const database = require('./database');
const ServerError = require('../errors/server-err');

const Task = {
  async readAll(req, res) {
    try {
      const readAllQuery = 'SELECT * FROM tasks';
      const { rows } = await database.query(readAllQuery);
      return res.send({ rows });
    } catch (error) {
      return res.send(error);
    }
  },
  async createTask(req, res) {
    try {
      const { text } = req.body;
      const ownerId = (req.user);
      const createTaskQuery = `insert into public.tasks (text, createdate, user_id) values ('${text}', current_date, ${ownerId})`;
      const newtask = await database.query(createTaskQuery);
      if (!newtask) {
        throw new ServerError('Внутренняя ошибка сервера');
      }
      return res.send({ message: 'Добавлена новая заметка' });
    } catch (error) {
      return res.send(error);
    }
  },
  async updateTask(req, res) {
    try {
      const { text } = req.body;
      const ownerId = (req.user);
      const taskId = req.params.id;
      const createTaskQuery = `update public.tasks set text = '${text}', updatedate = current_date where id = ${taskId} and user_id = ${ownerId}`;
      const newtask = await database.query(createTaskQuery);
      if (!newtask.rowCount) {
        throw new ServerError('Внутренняя ошибка сервера');
      }
      return res.send({ message: 'Заметка Обновлена' });
    } catch (error) {
      return res.send(error);
    }
  },
  async deleteTask(req, res) {
    try {
      const ownerId = (req.user);
      const taskId = req.params.id;
      const createTaskQuery = `delete from public.tasks where id = ${taskId} and user_id = ${ownerId}`;
      const newtask = await database.query(createTaskQuery);
      if (!newtask.rowCount) {
        throw new ServerError('Внутренняя ошибка сервера');
      }
      return res.send({ message: 'Заметка удалена' });
    } catch (error) {
      return res.send(error);
    }
  },
  async shareTask(req, res) {
    try {
      const ownerId = (req.user);
      const taskId = req.params.id;
      const link = Math.random().toString(36).substr(2, 10);
      const getAllTasksQuery = `SELECT * FROM public.tasks where user_id = ${ownerId} and id = ${taskId}`;
      const { rows } = await database.query(getAllTasksQuery);
      if (!rows) {
        throw new ServerError('Внутренняя ошибка сервера');
      }
      const createTaskQuery = `insert into sharedtask (task_id, linktask, visible_status) values (${taskId}, '${link}', true)`;
      const newtask = await database.query(createTaskQuery);
      if (!newtask.rowCount) {
        throw new ServerError('Внутренняя ошибка сервера');
      }
      return res.send({
        message: `Заметка расшарена и доступна по ссылке GET /tasks/free/${link}`,
      });
    } catch (error) {
      return res.send(error);
    }
  },

  async getFreeTask(req, res) {
    try {
      const link = req.params.id;
      const getAllTasksQuery = `select text from tasks, sharedtask where sharedtask.linktask = '${link}' and tasks.id = sharedtask.task_id and sharedtask.visible_status is true`;
      const { rows } = await database.query(getAllTasksQuery);
      if (!rows) {
        throw new ServerError('Внутренняя ошибка сервера');
      }
      return res.send({
        message: `По вашему запросу GET /tasks/free/${link} получена заметка:`,
        text: rows[0].text,
      });
    } catch (error) {
      return res.send(error);
    }
  },

  async getAllTasksUser(req, res) {
    try {
      const ownerId = (req.user);
      const getAllTasksQuery = `SELECT * FROM public.tasks where user_id = ${ownerId}`;
      const { rows } = await database.query(getAllTasksQuery);
      if (!rows) {
        throw new ServerError('Внутренняя ошибка сервера');
      }
      return res.send({ rows });
    } catch (error) {
      return res.send(error);
    }
  },
};

module.exports = Task;
