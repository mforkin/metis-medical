import * as _ from 'lodash';

const getUserBest = (userId, data) => {
    const filteredToUser = _.filter(data, r => r.userId === userId);
    const groupedByVignette = _.groupBy(filteredToUser, r => r.vignetteId)
    const bestByVignette = _.reduce(groupedByVignette, (bv, dataForVignette, vignetteId) => {
        const groupedByIter = _.groupBy(dataForVignette, f => f.iterationId)
        const scoreByIter = _.map(groupedByIter, i => {
            const groupedByQuestion = _.groupBy(i, r => r.questionId)
            const score = _.reduce(groupedByQuestion, (s, qd, qId) => {
                s.denom = s.denom + 1;
                if (qd[0].isCorrect) {
                    s.num = s.num + 1;
                }
                s.iterId = qd[0].iterationId;
                return s;
            }, {num: 0, denom: 0, iterId: -1})
            return score;
        });

        const best = _.maxBy(scoreByIter, i => i.num / i.denom)

        bv[vignetteId] = _.filter(dataForVignette, f => _.get(f, 'iterationId') === _.get(best, 'iterId'))
        _.forEach(bv[vignetteId], d => {
            _.set(d, 'num', _.get(best, 'num'))
            _.set(d, 'denom', _.get(best, 'denom'))
        })

        return bv;
    }, {});
    return bestByVignette;
}

const getMostRecent = (userId, data) => {
    const filteredToUser = _.filter(data, r => r.userId === userId);
    const groupedByVignette = _.groupBy(filteredToUser, r => r.vignetteId)
    const mostRecentByVignette = _.reduce(groupedByVignette, (mr, dataForVignette, vignetteId) => {
        const maxIteration = _.get(_.maxBy(dataForVignette, f => _.get(f, 'iterationId')), 'iterationId')
        mr[vignetteId] = _.filter(dataForVignette, f => _.get(f, 'iterationId') === maxIteration)
        const score = _.reduce(mr[vignetteId], (s, qd) => {
            s.denom = s.denom + 1;
            if (qd.isCorrect) {
                s.num = s.num + 1;
            }
            return s;
        }, {num: 0, denom: 0})
        _.forEach(mr[vignetteId], d => {
            _.set(d, 'num', _.get(score, 'num'));
            _.set(d, 'denom', _.get(score, 'denom'));
        })
        return mr;
    }, {});
    return mostRecentByVignette;
}

const results = (state = { results: [], latest: [], all: [], best: {}, mostRecent: {}, specResults: {} }, action) => {
    switch (action.type) {
        case 'LOAD_ALL_RESULTS':
            const data = _.get(action, 'data')
            const userId = _.get(action, 'userId')
            return {
                ...state,
                all: data,
                best: getUserBest(userId, data),
                mostRecent: getMostRecent(userId, data)
            };
            break;
        case 'LOAD_ALL_SPEC_RESULTS':
            return {
                ...state,
                specResults: _.get(action, 'data')
            };
            break;
        case 'LOAD_RESULTS':
            return {
                ...state,
                results: _.get(action, 'data'),
            };
            break;
        case 'LATEST_USER_RESULTS':
            return {
                ...state,
                latest: _.get(action, 'data')
            }
        default:
            return state;
            break;
    };
};

export default results;
