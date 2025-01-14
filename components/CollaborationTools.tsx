import React from 'react';
import { Users, GitBranch, MessageSquare, History, Share2, Plus } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

const CollaborationHub = () => {
  const teamMembers = [
    { id: 1, name: 'Sarah Chen', role: 'Data Scientist', avatar: '/api/placeholder/32/32' },
    { id: 2, name: 'Mike Ross', role: 'ML Engineer', avatar: '/api/placeholder/32/32' },
    { id: 3, name: 'Alex Kim', role: 'Developer', avatar: '/api/placeholder/32/32' }
  ];

  const recentActivities = [
    { id: 1, user: 'Sarah Chen', action: 'updated model parameters', time: '2h ago' },
    { id: 2, user: 'Mike Ross', action: 'added new dataset version', time: '4h ago' },
    { id: 3, user: 'Alex Kim', action: 'created experiment branch', time: '1d ago' }
  ];

  const experiments = [
    { id: 1, name: 'CNN Architecture v2', status: 'running', accuracy: '94.2%' },
    { id: 2, name: 'Transfer Learning Test', status: 'completed', accuracy: '92.8%' },
    { id: 3, name: 'Data Augmentation Study', status: 'pending', accuracy: '-' }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start mb-6">
          <div>
            <CardTitle className="text-2xl font-semibold mb-1">Collaboration Hub</CardTitle>
            <CardDescription className="text-gray-600">
              Manage team workspace and track experiments
            </CardDescription>
          </div>
          <Button className="bg-navy-900 hover:bg-navy-800">
            <Plus size={16} className="mr-2" />
            New Workspace
          </Button>
        </div>
        <Tabs defaultValue="team" className="w-full">
          <TabsList className="bg-gray-100 p-1 rounded-lg space-x-2">
            <TabsTrigger value="team" className="rounded">
              <Users size={16} className="mr-2" />
              Team
            </TabsTrigger>
            <TabsTrigger value="experiments" className="rounded">
              <GitBranch size={16} className="mr-2" />
              Experiments
            </TabsTrigger>
            <TabsTrigger value="comments" className="rounded">
              <MessageSquare size={16} className="mr-2" />
              Comments
            </TabsTrigger>
            <TabsTrigger value="activity" className="rounded">
              <History size={16} className="mr-2" />
              Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="team" className="mt-4">
            <div className="grid grid-cols-3 gap-4">
              {teamMembers.map(member => (
                <Card key={member.id} className="p-4 border border-gray-200">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback className="bg-gray-100 text-gray-600">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium text-sm">{member.name}</h4>
                      <p className="text-sm text-gray-500">{member.role}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="experiments" className="mt-4">
            <div className="space-y-3">
              {experiments.map(exp => (
                <Card key={exp.id} className="p-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <GitBranch size={20} className="text-gray-500" />
                      <div>
                        <h4 className="font-medium text-sm">{exp.name}</h4>
                        <p className="text-sm text-gray-500">Accuracy: {exp.accuracy}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={exp.status === 'running' ? 'default' : 
                                exp.status === 'completed' ? 'outline' : 'secondary'}
                        className={exp.status === 'completed' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}
                      >
                        {exp.status}
                      </Badge>
                      <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                        <Share2 size={16} />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="comments" className="mt-4">
            <Card className="p-4 border border-gray-200">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/api/placeholder/32/32" />
                    <AvatarFallback className="bg-gray-100 text-gray-600">SC</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea 
                      className="min-h-[100px] p-3 text-sm"
                      placeholder="Add a comment..."
                    />
                    <Button className="mt-3">Post Comment</Button>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="mt-4">
            <div className="space-y-3">
              {recentActivities.map(activity => (
                <Card key={activity.id} className="p-4 border border-gray-200">
                  <div className="flex items-center gap-3">
                    <History size={16} className="text-gray-500" />
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">{activity.user}</span>
                        {' '}
                        {activity.action}
                      </p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardHeader>
    </Card>
  );
};

export default CollaborationHub;