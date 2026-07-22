
import { Language } from "../lib/runner";

export type CodeContent = {
  language: Language;
  code: string;
};

export type ConceptTab = {
  type: string;
  content?: string;
  codeSnippets?: Array<CodeContent>;
};

export type Concept = {
  name: string;
  description: string;
  tabs: Array<ConceptTab>;
};

export type AppHeader = {
  title: string;
  options: Array<{
    title: string;
    concepts: Concept[];
  }>;
};


export type AppLayout = {
  headers: AppHeader[];
};

export const data: AppLayout = {
  headers: [
    {
      title: "Programming",
      options: [
        {
          title: "Basic programming",
          concepts: [
            {
              name: "Variables and data types",
              description:
                "Learn about different data types and how to use variables to store and manipulate data.",
              tabs: [
                {
                  type: "Story",
                  content:
                    "In the world of programming, variables are like containers that hold data. They can store different types of information, such as numbers, text, and more complex data structures. Understanding how to use variables and data types is fundamental to writing effective code.",
                },
                {
                  type: "Code",
                  codeSnippets: [
                    {
                      language: "python",
                      code: 'x = 10\nname = "Alice"\nis_student = True\nprint(x)\nprint(name)\nprint(is_student)',
                    },
                    {
                      language: "javascript",
                      code: 'let x = 10;\nlet name = "Alice";\nlet isStudent = true;\nconsole.log(x);\nconsole.log(name);\nconsole.log(isStudent);',
                    },
                    {
                      language: "java",
                      code: 'public class Temp {\n    public static void main(String[] args) {\n        int x = 10;\n        String name = "Alice";\n        boolean isStudent = true;\n        System.out.println(x);\n        System.out.println(name);\n        System.out.println(isStudent);\n    }\n}',
                    },
                  ],
                },
                {
                  type: "Quiz",
                  content:
                    "1. What is a variable?\n2. How do you declare a variable in Python?\n3. What are the different data types available in Python?",
                },
              ],
            },
            {
              name: "Control structures",
              description:
                "Understand how to use if statements, loops, and other control structures to manage the flow of your program.",
              tabs: [
                {
                  type: "Story",
                  content:
                    "Control structures are essential for managing the flow of a program. They allow you to make decisions, repeat actions, and control the execution of code based on certain conditions.",
                },
                {
                  type: "Code",
                  content:
                    'Here is an example of using an if statement and a loop in Python:\n\n```python\n# If statement\nage = 18\nif age >= 18:\n    print("You are an adult.")\nelse:\n    print("You are a minor.")\n\n# Loop\nfor i in range(5):\n    print(i)\n```\nThis code checks if a person is an adult and prints numbers from 0 to 4.',
                },
                {
                  type: "Quiz",
                  content:
                    "1. What is a control structure?\n2. How do you write an if statement in Python?\n3. What is a loop?",
                },
              ],
            },
            {
              name: "Functions and modules",
              description:
                "Discover how to create reusable code with functions and organize your code with modules.",
              tabs: [
                {
                  type: "Story",
                  content:
                    "Functions are reusable blocks of code that perform a specific task. Modules are files containing Python code that can be imported and used in other Python programs.",
                },
                {
                  type: "Code",
                  content:
                    'Here is an example of how to define and use a function in Python:\n\n```python\ndef greet(name):\n    return f"Hello, {name}!"\n\nprint(greet("Alice"))\n```\nThis code defines a function called `greet` that takes a name as an argument and returns a greeting message.',
                },
                {
                  type: "Quiz",
                  content:
                    "1. What is a function?\n2. How do you define a function in Python?\n3. What is a module?",
                },
              ],
            },
            {
              name: "Object-oriented programming",
              description:
                "Explore the principles of object-oriented programming, including classes, objects, inheritance, and polymorphism.",
              tabs: [
                {
                  type: "Story",
                  content:
                    "Object-oriented programming (OOP) is a programming paradigm that uses objects and classes to structure code. It allows for better organization, reusability, and scalability of code.",
                },
                {
                  type: "Code",
                  content:
                    'Here is an example of how to define a class and create an object in Python:\n\n```python\nclass Dog:\n    def __init__(self, name):\n        self.name = name\n    def bark(self):\n        return "Woof!"\n\nmy_dog = Dog("Buddy")\nprint(my_dog.name)\nprint(my_dog.bark())\n```\nThis code defines a `Dog` class with a constructor and a method, then creates an instance of the class.',
                },
                {
                  type: "Quiz",
                  content:
                    "1. What is a class?\n2. How do you create an object in Python?\n3. What is inheritance?",
                },
              ],
            },
          ],
        },
        {
          title: "Sorting techniques",
          concepts: [
            {
              name: "Bubble Sort",
              description:
                "Learn how the bubble sort algorithm works and how to implement it in different programming languages.",
              tabs: [
                {
                  type: "Story",
                  content:
                    "Bubble sort is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. The process is repeated until the list is sorted.",
                },
                {
                  type: "Code",
                  content:
                    'Here is an example of bubble sort implemented in Python:\n\n```python\ndef bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(0, n-i-1):\n            if arr[j] > arr[j+1]:\n                arr[j], arr[j+1] = arr[j+1], arr[j]\n    return arr\n\narr = [64, 34, 25, 12, 22, 11, 90]\nsorted_arr = bubble_sort(arr)\nprint("Sorted array is:", sorted_arr)\n```\nThis code defines a function `bubble_sort` that sorts an array using the bubble sort algorithm.',
                },
                {
                  type: "Quiz",
                  content:
                    "1. What is bubble sort?\n2. How does the bubble sort algorithm work?\n3. What is the time complexity of bubble sort?",
                },
              ],
            },
            {
              name: "Quick Sort",
              description:
                "Understand the quick sort algorithm and how to implement it efficiently.",
              tabs: [
                {
                  type: "Story",
                  content:
                    "Quick sort is a highly efficient sorting algorithm that uses a divide-and-conquer approach to sort elements. It works by selecting a 'pivot' element and partitioning the other elements into two sub-arrays according to whether they are less than or greater than the pivot.",
                },
                {
                  type: "Code",
                  content:
                    'Here is an example of quick sort implemented in Python:\n\n```python\ndef quick_sort(arr):\n    if len(arr) <= 1:\n        return arr\n    else:\n        pivot = arr[0]\n        less_than_pivot = [x for x in arr[1:] if x <= pivot]\n        greater_than_pivot = [x for x in arr[1:] if x > pivot]\n        return quick_sort(less_than_pivot) + [pivot] + quick_sort(greater_than_pivot)\n\narr = [10, 7, 8, 9, 1, 5]\nsorted_arr = quick_sort(arr)\nprint("Sorted array is:", sorted_arr)\n```\nThis code defines a function `quick_sort` that sorts an array using the quick sort algorithm.',
                },
                {
                  type: "Quiz",
                  content:
                    "1. What is quick sort?\n2. How does the quick sort algorithm work?\n3. What is the average time complexity of quick sort?",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
