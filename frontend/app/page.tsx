'use client';

import { Box, Card, CardActionArea, CardContent, Typography } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import Link from 'next/link';

const projects = [
  {
    title: 'SSH multi-console viewer',
    description: 'A web-based SSH multi-console viewer that allows you to connect to multiple devices at once.',
    href: 'ssh',
  },
  {
    title: 'AP version converter',
    description: 'A web-based AP version converter that allows you to convert AP version from one format to another.',
    href: 'ap-convert',
  },
  {
    title: 'QBV validation',
    description: 'QBV traffic generator and sniffer that allows you to validate QBV configuration.',
    href: 'qbv',
  },
];

type ProjectType = (typeof projects)[0];

export default function Page() {
  return (
    <Box component='main' sx={{ p: 2 }} className='max-w-[90rem] mx-auto'>
      <Grid2 container spacing={2}>
        {projects.map((project) => (
          <Grid2 xs={12} md={6} lg={4} xl={3} key={project.title}>
            <ProjectCard project={project} />
          </Grid2>
        ))}
      </Grid2>
    </Box>
  );
}

const ProjectCard = ({ project }: { project: ProjectType }) => {
  return (
    <Card>
      <CardActionArea href={project.href} LinkComponent={Link}>
        <CardContent>
          <Typography gutterBottom variant='h5' component='div'>
            {project.title}
          </Typography>
          <Box py={1} />
          <Typography variant='body2' color='text.secondary'>
            {project.description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
