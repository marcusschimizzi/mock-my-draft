# Draft Class Grades Format

Each entry in `YYYY_draft_class_grades.json` should be:

```json
{
  "teamName": "Chicago Bears",
  "year": 2024,
  "grade": "A-",
  "gradeNumeric": 3.7,
  "text": "Optional analysis text"
}
```

The seed script will match `teamName` to the teams table by name.
Grade scale: A+ = 4.3, A = 4.0, A- = 3.7, B+ = 3.3, B = 3.0, etc.
