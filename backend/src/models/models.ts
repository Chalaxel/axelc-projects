import { getSessionModel, initSessionModel, SessionInstance } from './Session';
import { getUserModel, initUserModel, UserInstance } from './User';
import {
    getTriathlonPlanModel,
    initTriathlonPlanModel,
    TriathlonPlanInstance,
} from './TriathlonPlan';
import { getGoalModel, initGoalModel, GoalInstance } from './Goal';
import { getDatabase } from 'src/utils/dbSync';
import { runMigrations } from 'src/utils/migrate';
import { ModelStatic } from 'sequelize';

export let models: {
    Session: ModelStatic<SessionInstance>;
    User: ModelStatic<UserInstance>;
    TriathlonPlan: ModelStatic<TriathlonPlanInstance>;
    Goal: ModelStatic<GoalInstance>;
};

export const setModels = async () => {
    const db = getDatabase();

    initSessionModel(db);
    initUserModel(db);
    initTriathlonPlanModel(db);
    initGoalModel(db);

    const SessionModel = getSessionModel();
    const UserModel = getUserModel();
    const TriathlonPlanModel = getTriathlonPlanModel();
    const GoalModel = getGoalModel();

    GoalModel.belongsTo(UserModel, { foreignKey: 'userId', as: 'user' });
    UserModel.hasMany(GoalModel, { foreignKey: 'userId', as: 'goals' });

    await runMigrations();

    models = {
        Session: SessionModel,
        User: UserModel,
        TriathlonPlan: TriathlonPlanModel,
        Goal: GoalModel,
    };
};
