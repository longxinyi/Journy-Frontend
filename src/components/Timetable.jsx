import styles from './Timetable.module.css';

const Timetable = ({ data }) => {
  return (
    <div className={styles.timetable}>
      {data.map((day, index) => (
        <div key={index}>
          <div className={styles.dateHeader}>
            <strong>{day.date}</strong>
          </div>
          {day.activities.map((activity, index) => (
            <div className={styles.activity} key={index}>
              <div className={styles.dot}></div>
              <div className={styles.time}>{activity.time}</div>
              <div>{activity.name}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Timetable;
