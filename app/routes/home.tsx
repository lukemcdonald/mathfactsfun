import { Icons } from '#app/components/icons'
import { Button } from '#app/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '#app/components/ui/card'

export function meta() {
  return [
    { title: 'MathFacts.fun' },
    {
      content: 'Master math facts through fun and engaging practice!',
      name: 'description',
    },
  ]
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <main className="container mx-auto px-4 py-16">
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-5xl font-bold text-gray-900 dark:text-white">MathFacts.fun</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Master math facts through fun and engaging practice!
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card className="transform transition-all hover:scale-105">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icons.Calculator className="h-6 w-6 text-blue-500" />
                Practice Math Facts
              </CardTitle>
              <CardDescription>
                Master addition, subtraction, multiplication, and division through interactive
                exercises
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Start Practicing</Button>
            </CardContent>
          </Card>

          <Card className="transform transition-all hover:scale-105">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icons.School className="h-6 w-6 text-green-500" />
                For Teachers
              </CardTitle>
              <CardDescription>
                Create groups, manage students, and track their progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full"
                variant="outline"
              >
                Teacher Dashboard
              </Button>
            </CardContent>
          </Card>

          <Card className="transform transition-all hover:scale-105">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icons.Brain className="h-6 w-6 text-purple-500" />
                Smart Learning
              </CardTitle>
              <CardDescription>
                Adaptive learning system that focuses on improvement areas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full"
                variant="outline"
              >
                Learn More
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <h2 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">
            Why Choose MathFacts.fun?
          </h2>
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-6">
              <Icons.Users className="mx-auto mb-4 h-12 w-12 text-blue-500" />
              <h3 className="mb-2 text-xl font-semibold">For Schools</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Easy to manage multiple classes and track student progress
              </p>
            </div>
            <div className="p-6">
              <Icons.Calculator className="mx-auto mb-4 h-12 w-12 text-green-500" />
              <h3 className="mb-2 text-xl font-semibold">Comprehensive Practice</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Cover all basic operations with customizable difficulty levels
              </p>
            </div>
            <div className="p-6">
              <Icons.Brain className="mx-auto mb-4 h-12 w-12 text-purple-500" />
              <h3 className="mb-2 text-xl font-semibold">Smart Learning</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Focus on areas that need improvement with our adaptive system
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
